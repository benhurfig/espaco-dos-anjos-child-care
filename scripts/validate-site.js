'use strict';
// Compatibility entry point; the read-only validator uses only Python's standard library.
const {spawnSync}=require('child_process');
const path=require('path');
const interpreter=process.platform==='win32'?'python':'python3';
const result=spawnSync(interpreter,[path.join(__dirname,'validate_site.py'),...process.argv.slice(2)],{stdio:'inherit'});
if(result.error){console.error('Python 3 não encontrado. Execute o validador com Python 3: scripts/validate_site.py');process.exitCode=1;}
else process.exitCode=result.status??1;
