import assert from 'node:assert/strict'; import {readFile} from 'node:fs/promises';
const src=await readFile(new URL('../lib/calculators/propertyDecision.js',import.meta.url),'utf8'); assert(src.includes('analyzeProperty')); console.log('Property Decision engine source is present.');
