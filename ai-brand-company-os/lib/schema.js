'use strict';
// Small strict validator for the explicitly documented subset used by this repo.
// Not a general JSON Schema implementation; unknown keywords fail, never get ignored.
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const keys = new Set(['$schema','title','description','type','const','enum','required','properties','additionalProperties','items','minItems','maxItems','uniqueItems','minimum','maximum','minLength','maxLength','pattern','format']);
function validTime(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return false;
  const n = Date.parse(value);
  return Number.isFinite(n) && new Date(n).toISOString().replace('.000Z','Z') === value.replace('.000Z','Z');
}
function validate(value, schema, at = '$') {
  const errors = [];
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return [at + ': invalid schema'];
  for (const k of Object.keys(schema)) if (!keys.has(k)) errors.push(at + ': unsupported schema keyword ' + k);
  const types = schema.type === undefined ? [] : [].concat(schema.type);
  const isType = t => t === 'null' ? value === null :
    t === 'array' ? Array.isArray(value) : t === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value) :
    t === 'integer' ? Number.isSafeInteger(value) :
    t === 'number' ? typeof value === 'number' && Number.isFinite(value) :
    t === 'boolean' ? typeof value === 'boolean' : t === 'string' ? typeof value === 'string' : false;
  if (types.length && !types.some(isType)) return errors.concat(at + ': type mismatch');
  if (own(schema,'const') && JSON.stringify(value) !== JSON.stringify(schema.const)) errors.push(at + ': const mismatch');
  if (schema.enum && !schema.enum.some(v => JSON.stringify(v) === JSON.stringify(value))) errors.push(at + ': enum mismatch');
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && [...value].length < schema.minLength) errors.push(at + ': too short');
    if (schema.maxLength !== undefined && [...value].length > schema.maxLength) errors.push(at + ': too long');
    if (schema.pattern && !(new RegExp(schema.pattern)).test(value)) errors.push(at + ': pattern mismatch');
    if (schema.format && (schema.format !== 'date-time' || !validTime(value))) errors.push(at + ': invalid format');
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) errors.push(at + ': not finite');
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(at + ': below minimum');
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(at + ': above maximum');
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(at + ': too few items');
    if (schema.maxItems !== undefined && value.length > schema.maxItems) errors.push(at + ': too many items');
    if (schema.uniqueItems && new Set(value.map(v => JSON.stringify(v))).size !== value.length) errors.push(at + ': duplicate items');
    if (schema.items) value.forEach((v,i) => errors.push(...validate(v,schema.items,at+'['+i+']')));
  } else if (value !== null && typeof value === 'object') {
    for (const k of schema.required || []) if (!own(value,k)) errors.push(at + ': required ' + k);
    for (const k of Object.keys(value)) {
      if (schema.properties && own(schema.properties,k)) errors.push(...validate(value[k],schema.properties[k],at+'.'+k));
      else if (schema.additionalProperties === false) errors.push(at + ': unknown field ' + k);
    }
  }
  return errors;
}
module.exports = { validate, validTime };
