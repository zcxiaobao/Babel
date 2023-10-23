const core = require("@babel/core");
// const {
//   ArrowTransformFunctionPlugin,
// } = require("./plugin-transform-arrow-functions.js");

const {
  ArrowTransformFunctionPlugin,
} = require("./plugin-transform-arrow-functions-improve.js");

// const sourceCode = `var func = (a) => a;`;
// const sourceCode = `const func = function (a) {
//   console.log(this);
//   function aaa() {
//     console.log(this);
//   }
//   return (a) => {
//     console.log(this);
//     function ccc() {
//       console.log(this)
//       return () => {
//         console.log(this)
//       }
//     }
//     return a;
//   };
// };
// `;

const sourceCode = `const func = function (a) {
  console.log(this);
  function aaa() {
    console.log(this);
  }
  return (a) => {
    console.log(this);
    function ccc() {
      console.log(this);
      return () => {
        console.log(this);
      };
    }
    return a;
  };
};
`;
console.log("== 转换前 ==");
console.log(sourceCode);
const { code } = core.transformSync(sourceCode, {
  plugins: [ArrowTransformFunctionPlugin],
});
console.log("== 转换后 ==");
console.log(code);
