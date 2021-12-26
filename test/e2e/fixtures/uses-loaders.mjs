import React from 'react';
import quibble from 'quibble'

await quibble.esm('./foo.mjs', {answer: 42})

const value = <div>TEST</div>

console.log(value.type, (await import('./foo.mjs')).answer)
