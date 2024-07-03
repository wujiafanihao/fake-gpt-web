import { useEffect, useLayoutEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-rest';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-typescript';

/**
 * 自定义 Hook：用于代码高亮
 * @param dependencies 依赖项数组，当其中任意依赖项发生变化时触发高亮操作
 * @param syncExecution 是否使用 useLayoutEffect，true 表示在 DOM 更新前同步执行高亮操作
 */
const useCodeHighlight = (dependencies: any[], syncExecution: boolean = false) => {
  // 选择 useEffect 或 useLayoutEffect 作为副作用函数
  const effectHook = syncExecution ? useLayoutEffect : useEffect;

  effectHook(() => {
    // 在依赖项变化时执行代码高亮
    console.log('Code highlight hook triggered'); 
    Prism.highlightAll();
  }, dependencies);
  
};

export default useCodeHighlight;
