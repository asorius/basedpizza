import Head from 'next/head';
import { AdditionForm } from '../components/AdditionForm';

export default function Home() {
  return (
    <>
      <Head>
        <title>Pizza Base</title>
        <meta
          name='description'
          content='Pizza colliseum, pizza forum, pizza information.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <div>
          <AdditionForm></AdditionForm>
        </div>
      </main>
    </>
  );
}
