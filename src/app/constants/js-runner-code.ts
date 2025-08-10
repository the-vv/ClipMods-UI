import { ESandboxResultTypes } from "../enums/mod-results.enum";

export function getJsRunnerCode(jsCode: string, inputs: string[], noDev: boolean): string {
  return `
  try {
    ${jsCode}
    document.addEventListener("DOMContentLoaded", function() {
      const inputs = ${JSON.stringify(inputs)};
      if (typeof executeMod === 'function') {
        // Call the executeMod function with inputs
        const utilsObject = {
          _: window._, // lodash
          dateFns: window.dateFns // date-fns
        };
        let result = null;
        try {
          result = executeMod(inputs, utilsObject);
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
