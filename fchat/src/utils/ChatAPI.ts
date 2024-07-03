/**
 * ChatAPI 类定义一个向服务器发送 POST 请求的 API。
 */
class ChatAPI {
  /**
   * @property {string} address - 服务器地址。在构造函数初始化时传入。
   */
  address: string;

  /**
   * @constructor
   * @param {string} address - API服务器地址，在构造函数中接受并初始化该属性。
   */
  constructor(address: string) {
    this.address = address;
    console.log('Sending request to:', this.address);
  }

  /**
   * @method sendMessage
   * @param {string} message - 要发送的消息。
   * @param {Function} handleStream - 用于处理服务器返回的数据流的函数，每收到一chunk数据会被调用。
   * @param {AbortSignal} signal - 可以用来取消请求的signal。
   */
  async sendMessage(message: string, handleStream: (chunk: string, errorMessage: string) => void, signal: AbortSignal): Promise<void> {
    try {
      const TIMEOUT_MS = 3000; // 超时时间为 3 秒。
      let timeoutId: NodeJS.Timeout | null = null; // 初始化为 null。

      /**
       * 该 Promise 会等待 fetch 返回的响应或超时后结束，优先接收响应结果。
       */
      const responsePromise = new Promise<Response>((resolve, reject) => {
        try {
          // 'POST'请求方式，设置头部为 application/json 类型，body 为 json 字符串，signal 传递给 fetch 函数。
          const requestOptions: RequestInit = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: message }), signal };
          // 发送请求。
          fetch(this.address, requestOptions).then((response) => resolve(response));
        } catch (error) {
          reject(error);
        }
      });

      /**
       * 该 Promise 会在指定的超时时间后结束。
       */
      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => resolve(), TIMEOUT_MS);
      });

      // responsePromise 和 timeoutPromise 比较大，Promise.race 会返回先完成的那个 Promise。
      /**
       * 等待响应或超时，并判断超时情况下取消请求。
       */
      const response = await Promise.race([responsePromise, timeoutPromise]);
      // 如果有定时器，则清除定时器。
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      /**
       * 判断是否收到响应，并在未接受到响应的情况下抛出异常。
       */
      if (!response) {
        throw new Error('Request timed out');
      }

      /**
       * 判断服务器响应状态码是否为正常情况（200-299），如果不是则抛出异常。
       */
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const reader = response.body!.getReader(); // 获取响应体的阅读器
      const decoder = new TextDecoder(); // 创建一个文本解码器

      /**
       * 循环处理每次从服务器获得的数据流，直到没有更多数据流为止。
       */
      while (true) {
        const { value, done } = await reader.read(); // 读取下一chunk 数据
        
        if (done) break; // 如果已读完则退出循环

        /**
         * handleStream 会在每次收到一个chunk 后被调用，并且会传递当前的 chunk 和 errorMessage（在异常发生时传递错误信息）。
         */
        const chunk = decoder.decode(value); // 解码当前 chunk
        handleStream(chunk, ''); // 处理当前 chunk，错误信息为空字符串
        console.log('Received chunk:', chunk); // 在控制台输出收到的 chunk

      }
    } catch (error) {
      console.error('Error sending request:', error); // 记录发送请求时的错误
      const errorMessage = `Error: ${error instanceof Error ? error.message : error}`; // 处理不同类型的 error（实例或原生错误）并传递给 handleStream
handleStream('', errorMessage); // 传递错误信息，数据流为空字符串

    }
  }
}

/**
 * 导出 ChatAPI 类供在其他模块中使用。
 */
export { ChatAPI };
