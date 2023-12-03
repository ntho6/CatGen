document.addEventListener('DOMContentLoaded', () => {
  const inputUrl = document.getElementById('inputUrl');
  const submitButton = document.getElementById('submitButton');
  const resultElement = document.getElementById('result');
  let isFirstSearch = true;

  submitButton.addEventListener('click', async () => {
    const knowId = extractKnowId(inputUrl.value);

    if (knowId) {
      const contentUrls = await getContentUrls(knowId);
      if (contentUrls.length > 0) {
        resultElement.textContent = '';

        if (contentUrls.length === 1) {
          createDownloadLink(contentUrls[0], 'Download PDF');
        } else {
          contentUrls.forEach((contentUrl, index) => {
            createDownloadLink(contentUrl, `Download PDF ${index + 1}`);
          });
        }

        isFirstSearch = false;
      } else {
        resultElement.textContent = 'No PDFs found.';
      }
    } else {
      resultElement.textContent = 'Invalid input URL format.';
    }
  });

  function extractKnowId(inputUrl) {
    const match = inputUrl.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    return match ? match[0] : null;
  }

  async function getContentUrls(knowId) {
    const apiUrl = `https://apiedge-eu-central-1.knowunity.com/knows/${knowId}`;
    try {
      const response = await fetch(apiUrl);
      if (response.status === 200) {
        const json = await response.json();
        return json.documents.map(document => document.contentUrl);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return [];
  }

  function createDownloadLink(url, label) {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = label;
    link.download = 'document.pdf';
    link.style.display = 'block';
    resultElement.appendChild(link);
  }
});
