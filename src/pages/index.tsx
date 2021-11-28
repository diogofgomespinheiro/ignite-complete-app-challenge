import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';

import TextIcon from '../components/TextIcon';
import { getPrismicClient, fetcher } from '../services';
import { formatDate } from '../utils';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  firstPublicationDate: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostsPagination {
  nextPageUrl: string;
  posts: Post[];
}

interface HomeProps {
  postsPagination: PostsPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [{ nextPageUrl, posts }, setPostsPagination] =
    useState(postsPagination);

  async function loadMorePosts() {
    const response = await fetcher<ApiSearchResponse>(nextPageUrl);

    const mappedPosts: Post[] = response.results.map<Post>(result => ({
      uid: result.uid,
      firstPublicationDate: result.first_publication_date,
      data: {
        title: result.data.title,
        subtitle: result.data.subtitle,
        author: result.data.author,
      },
    }));

    setPostsPagination(prevState => ({
      nextPageUrl: response.next_page,
      posts: [...prevState.posts, ...mappedPosts],
    }));
  }

  return (
    <>
      <Head>
        <title>Home | spacetravelling</title>
      </Head>
      <main className={styles.wrapper}>
        <div className={styles.container}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <div className={styles.postContent}>
                  <h4>{post.data.title}</h4>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.infoContainer}>
                    <TextIcon
                      icon="calendar"
                      text={formatDate(post.firstPublicationDate)}
                    />
                    <TextIcon icon="user" text={post.data.author} />
                  </div>
                </div>
              </a>
            </Link>
          ))}
          {nextPageUrl && (
            <button type="button" onClick={loadMorePosts}>
              Load more posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { results: posts = [], next_page } = await getPrismicClient().query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      pageSize: 20,
    }
  );

  const mappedPosts: Post[] = posts.map<Post>(result => ({
    uid: result.uid,
    firstPublicationDate: result.first_publication_date,
    data: {
      title: result.data.title,
      subtitle: result.data.subtitle,
      author: result.data.author,
    },
  }));

  return {
    props: {
      postsPagination: {
        nextPageUrl: next_page,
        posts: mappedPosts,
      },
    },
  };
};
