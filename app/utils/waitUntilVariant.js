export default async function waitUntilVariant(condition, timeout = 10000) {
  if (condition()) return true;
  return await new Promise((resolve, reject) => {
    let totalTime = 0;
    const handler = setInterval(() => {
      if (condition()) {
        clearInterval(handler);
        resolve(true);
      } else {
        totalTime = totalTime + 200;
        console.log('[DEBUG WAIT]' + totalTime);
        if (totalTime > timeout) {
          clearInterval(handler);
          reject(false);
        }
      }
    }, 200);
  });
}
