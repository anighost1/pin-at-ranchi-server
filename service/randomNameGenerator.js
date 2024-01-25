
function generateUniqueFileName(originalFileName) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10); // Generate a 8-character random string using Math.random()
  
    const fileExtension = originalFileName.includes('.')
      ? originalFileName.substring(originalFileName.lastIndexOf('.'))
      : '';
  
    const uniqueFileName = `${timestamp}_${randomString}${fileExtension}`;
  
    return uniqueFileName;
  }
  
export default generateUniqueFileName