import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Prismic from '@prismicio/client';
import { RichText, RichTextBlock } from 'prismic-reactjs';

import TextIcon from '../../components/TextIcon';
import { getPrismicClient } from '../../services';
import { formatDate, calculateEstimatedReadingTime } from '../../utils';

import styles from './post.module.scss';

interface Post {
  firstPublicationDate: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
      dimensions: {
        height: number;
        width: number;
      };
    };
    author: string;
    estimatedReadingTime: number;
    content: {
      heading: string;
      body: RichTextBlock[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  const { data, firstPublicationDate } = post;
  const { banner, title, author, content, estimatedReadingTime } = data;

  return (
    <>
      <Head>
        <title>{title} | spacetravelling</title>
      </Head>
      <main>
        {router.isFallback && <div>Carregando...</div>}
        <Image
          src={banner.url}
          alt={banner.alt}
          height={600}
          width={banner.dimensions.width}
          objectFit="cover"
        />
        <div className={styles.postWrapper}>
          <article className={styles.postContainer}>
            <div className={styles.postHeading}>
              <h1>{title}</h1>
              <div>
                <TextIcon
                  icon="calendar"
                  text={formatDate(firstPublicationDate)}
                />
                <TextIcon icon="user" text={author} />
                <TextIcon icon="clock" text={`${estimatedReadingTime} min`} />
              </div>
            </div>
            <div className={styles.postBody}>
              {content.map(item => (
                <div key={item.heading}>
                  <h2>{item.heading} </h2>
                  <RichText render={item.body} />
                </div>
              ))}
            </div>
          </article>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      pageSize: 50,
    }
  );

  const paths = response.results.map(result => ({
    params: { slug: result.uid },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const { first_publication_date, data } = await prismic.getByUID(
    'posts',
    String(slug),
    {}
  );

  const { title, banner, author, content } = data;
  const estimatedReadingTime = calculateEstimatedReadingTime(content);

  const post: Post = {
    firstPublicationDate: first_publication_date,
    data: {
      title,
      banner: {
        url: banner.url,
        alt: banner.alt,
        dimensions: banner.dimensions,
      },
      estimatedReadingTime,
      author,
      content,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 24 * 3, // 3 days
  };
};
