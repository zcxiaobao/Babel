const t = require("@babel/types");
/**
 * 处理箭头函数中的 this
 * @param nodePath 节点路径
 */

function hoistFunctionEnvironment(nodePath) {
  // 获取 this 作用域
  const thisContext = nodePath.findParent(
    (path) =>
      (path.isFunction() && !path.isArrowFunctionExpression()) ||
      path.isProgram()
  );
  let thisBinding = nodePath.scope.generateUid("_this");

  // 获取当前 AST 节点中使用 this 的节点
  const thisPaths = getUseThisPaths(nodePath);
  if (thisPaths.length) {
    // 创建变量 _this
    if (
      !thisContext.scope.hasBinding(thisBinding, {
        noUids: true,
      })
    ) {
      // 定义 var _this = this;
      thisContext.scope.push({
        id: t.identifier(thisBinding),
        init: t.thisExpression(),
      });
    }
    // 替换 this
    thisPaths.forEach((thisPath) => {
      thisPath.replaceWith(t.identifier(thisBinding));
    });
  }
}

/**
 * 获取箭头函数中使用 this 的节点
 * @param nodePath 节点路径
 */

function getUseThisPaths(nodePath) {
  const thisPaths = [];
  nodePath.traverse({
    ThisExpression(path) {
      block = path.scope.path;
      if (path.scope.path === nodePath) thisPaths.push(path);
    },
  });
  return thisPaths;
}
const ArrowTransformFunctionPlugin = {
  visitor: {
    ArrowFunctionExpression(path) {
      const { node } = path;
      hoistFunctionEnvironment(path);
      node.type = "FunctionExpression";
      // 手动修复node.body
      if (!t.isBlockStatement(node.body)) {
        node.body = t.blockStatement([t.returnStatement(node.body)]);
      }
    },
  },
};

module.exports = {
  ArrowTransformFunctionPlugin,
};
