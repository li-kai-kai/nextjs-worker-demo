const workerpool = require('workerpool');

/**
 * 通用Worker - 支持依赖注入的函数执行环境
 * 这个Worker是纯粹的执行环境，业务逻辑和依赖通过参数传入
 */

// 依赖缓存
const dependencyCache = new Map();

/**
 * 加载依赖模块
 * @param {string[]} dependencies - 依赖模块名称列表
 * @returns {Object} 依赖模块映射
 */
function loadDependencies(dependencies = []) {
  const deps = {};
  
  for (const dep of dependencies) {
    try {
      if (!dependencyCache.has(dep)) {
        dependencyCache.set(dep, require(dep));
      }
      deps[dep] = dependencyCache.get(dep);
    } catch (error) {
      console.warn(`Failed to load dependency: ${dep}`, error.message);
      deps[dep] = null;
    }
  }
  
  return deps;
}

/**
 * 执行函数代码（支持依赖注入）
 * @param {string} functionCode - 要执行的函数代码字符串
 * @param {string} functionName - 函数名
 * @param {any[]} args - 函数参数
 * @param {string[]} dependencies - 依赖模块列表
 * @returns {Promise<any>} 执行结果
 */
async function execute(functionCode, functionName, args = [], dependencies = []) {
  try {
    // 加载依赖
    const deps = loadDependencies(dependencies);
    
    // 创建函数执行环境
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    
    // 构建完整的函数代码，将依赖作为参数传入
    const depNames = Object.keys(deps);
    const depValues = Object.values(deps);
    
    const fullCode = `
      ${functionCode}
      return await ${functionName}(...arguments);
    `;
    
    // 创建并执行函数，依赖作为额外参数传入
    const fn = new AsyncFunction(...depNames, fullCode);
    const result = await fn.apply(null, [...depValues, ...args]);
    
    return {
      success: true,
      result,
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
      dependenciesLoaded: depNames
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage()
    };
  }
}

/**
 * 执行同步函数（支持依赖注入）
 * @param {string} functionCode - 要执行的函数代码字符串
 * @param {string} functionName - 函数名
 * @param {any[]} args - 函数参数
 * @param {string[]} dependencies - 依赖模块列表
 * @returns {any} 执行结果
 */
function executeSync(functionCode, functionName, args = [], dependencies = []) {
  try {
    // 加载依赖
    const deps = loadDependencies(dependencies);
    
    // 创建函数执行环境
    const depNames = Object.keys(deps);
    const depValues = Object.values(deps);
    
    const fullCode = `
      ${functionCode}
      return ${functionName}(...arguments);
    `;
    
    // 创建并执行函数，依赖作为额外参数传入
    const fn = new Function(...depNames, fullCode);
    const result = fn.apply(null, [...depValues, ...args]);
    
    return {
      success: true,
      result,
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
      dependenciesLoaded: depNames
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage()
    };
  }
}

/**
 * 执行编译后的bundle代码
 * @param {string} bundleCode - 编译后的完整bundle代码
 * @param {string} functionName - 要执行的函数名
 * @param {any[]} args - 函数参数
 * @returns {Promise<any>} 执行结果
 */
async function executeBundle(bundleCode, functionName, args = []) {
  try {
    // 创建一个模块作用域来执行bundle
    const moduleScope = {
      exports: {},
      module: { exports: {} },
      require: require,
      process: process,
      Buffer: Buffer,
      __dirname: __dirname,
      __filename: __filename,
      console: console,
      setTimeout: setTimeout,
      setInterval: setInterval,
      clearTimeout: clearTimeout,
      clearInterval: clearInterval
    };

    // 使用Function构造器创建模块执行环境
    const moduleWrapper = new Function(
      'exports', 'module', 'require', 'process', 'Buffer', '__dirname', '__filename', 
      'console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
      bundleCode
    );

    // 执行bundle代码
    moduleWrapper.call(
      moduleScope,
      moduleScope.exports,
      moduleScope.module,
      moduleScope.require,
      moduleScope.process,
      moduleScope.Buffer,
      moduleScope.__dirname,
      moduleScope.__filename,
      moduleScope.console,
      moduleScope.setTimeout,
      moduleScope.setInterval,
      moduleScope.clearTimeout,
      moduleScope.clearInterval
    );

    // 获取导出的函数
    const exportedFunctions = moduleScope.module.exports;
    
    if (typeof exportedFunctions !== 'object' || !exportedFunctions) {
      throw new Error('Bundle did not export an object');
    }

    const targetFunction = exportedFunctions[functionName];
    if (typeof targetFunction !== 'function') {
      const availableFunctions = Object.keys(exportedFunctions).filter(
        key => typeof exportedFunctions[key] === 'function'
      );
      throw new Error(
        `Function '${functionName}' not found or not a function. Available functions: [${availableFunctions.join(', ')}]`
      );
    }

    // 执行目标函数
    let result = targetFunction.apply(null, args);
    
    // 如果返回Promise，等待其完成
    if (result && typeof result.then === 'function') {
      result = await result;
    }

    return {
      success: true,
      result,
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
      functionName,
      bundleSize: Buffer.byteLength(bundleCode, 'utf8')
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
      functionName,
      bundleSize: bundleCode ? Buffer.byteLength(bundleCode, 'utf8') : 0
    };
  }
}

// 注册Worker方法
workerpool.worker({
  execute,
  executeSync,
  executeBundle
});