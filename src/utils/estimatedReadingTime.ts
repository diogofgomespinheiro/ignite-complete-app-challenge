import { RichTextBlock } from 'prismic-reactjs';
import { RichText } from 'prismic-dom';

function getNumberOfWordsFromText(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function calculateEstimatedReadingTime(
  content: {
    heading: string;
    body: RichTextBlock[];
  }[]
): number {
  const wordCount = content.reduce((accumulator: number, { heading, body }) => {
    const headingWordCount = getNumberOfWordsFromText(heading);
    const bodyWordCount = getNumberOfWordsFromText(RichText.asText(body));

    return accumulator + headingWordCount + bodyWordCount;
  }, 0);

  return Math.ceil(wordCount / 225);
}
