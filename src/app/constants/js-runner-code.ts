import { ESandboxResultTypes } from "../enums/mod-results.enum";

export function getJsRunnerCode(jsCode: string, inputs: string[], multiline: boolean, noDev: boolean): string {
  return `
  ${jsCode}
  try {
    document.addEventListener("DOMContentLoaded", function() {
      const inputs = ${JSON.stringify(getSanitizedInputs(inputs))};
      if (typeof executeMod === 'function') {
        // Call the executeMod function with inputs
        const utilsObject = {
          _: window._, // lodash
          dateFns: window.dateFns // date-fns
        };
        let result = null;
        try {
          if (${multiline}) {
            // split inputs by newline and execute the mod code for each line
            const splitArgs = inputs.map((input, index) => input.split('\\n'));
            const maxLength = Math.max(...splitArgs.map(arr => arr.length));
            const results = [];
            for (let i = 0; i < maxLength; i++) {
              const args = splitArgs.map(arr => arr[i] || '');
              const res = executeMod(args, utilsObject);
              if (res && res.result) {
                results.push(res.result);
              }
            }
            result = { result: results.join('\\n') };
          } else {
            result = executeMod(inputs, utilsObject);
          }
        } catch (error) {
          console.log('Error executing mod code:', error);
          parent.postMessage({
            type: '${ESandboxResultTypes.MOD_ERROR}',
            data: error.message || 'An error occurred while executing the mod code'
          }, '${window.location.origin}');
          return;
        }
        if (result && result.result) {
          console.log('Mod Result:', result.result);
          parent.postMessage({
            type: '${ESandboxResultTypes.MOD_RESULT}',
            data: result.result
          }, '${window.location.origin}');
        } else {
          console.log('Mod execution failed: Function executeMod did not return a valid result');
          parent.postMessage({
            type: '${ESandboxResultTypes.MOD_ERROR}',
            data: '${noDev ? 'Mod did not return a valid result' : 'Function executeMod did not return a valid result'}'
          }, '${window.location.origin}');
        }
      } else {
        console.log('executeMod function is not defined');
        parent.postMessage({
          type: '${ESandboxResultTypes.MOD_ERROR}',
          data: '${noDev ? 'Mod is not properly defined' : 'Function executeMod is not defined'}'
        }, '${window.location.origin}');
      }
    });
  } catch (error) {
    console.error('Error in sandbox script:', error);
    parent.postMessage({
      type: '${ESandboxResultTypes.MOD_ERROR}',
      data: error.message || 'An error occurred in the sandbox script'
    }, '${window.location.origin}');
  }
`;
}

function getSanitizedInputs(inputs: string[]): string[] {
  return inputs.map(i =>
    i.replace(/<\/script/gi, "<\\/script")
  )
}
