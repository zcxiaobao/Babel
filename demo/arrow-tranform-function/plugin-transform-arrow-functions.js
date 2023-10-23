const t = require("@babel/types");
const template = require("@babel/template");
// 创建 AST 节点
// const ArrowTransformFunctionPlugin = {
//   visitor: {
//     ArrowFunctionExpression(path) {
//       const { node } = path;
//       const id = node.id;
//       const params = node.params;
//       const body = t.blockStatement([t.returnStatement(node.body)]);

//       const functionExpression = t.functionExpression(id, params, body);
//       path.replaceWith(functionExpression);
//     },
//   },
// };

// 使用 template 创建 AST 节点
// const ArrowTransformFunctionPlugin = {
//   visitor: {
//     ArrowFunctionExpression(path) {
//       const { node } = path;
//       const id = node.id;
//       const params = node.params;
//       const body = node.body;

//       const functionExpression = template.expression(
//         "function %%FUNC_NAME%%(%%PARAMS%%){return %%RETURN_STATE%%}"
//       )({ FUNC_NAME: id, PARAMS: params, RETURN_STATE: body });
//       path.replaceWith(functionExpression);
//     },
//   },
// };

// 复用原节点 + ensureBlock
// const ArrowTransformFunctionPlugin = {
//   visitor: {
//     ArrowFunctionExpression(path) {
//       const { node } = path;
//       node.type = "FunctionExpression";
//     },
//   },
// };

const ArrowTransformFunctionPlugin = {
  visitor: {
    ArrowFunctionExpression(path) {
      const { node } = path;
      node.type = "FunctionExpression";
      // 手动修复node.body
      if (t.isBlockElement(node.body)) {
        node.body = t.blockStatement([t.returnStatement(node.body)]);
      }
    },
  },
};

module.exports = {
  ArrowTransformFunctionPlugin,
};
