import '../styles/globals.css';
import Image from 'next/image';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <div className='footer'>
        <Image
          alt='Pokemon'
          src={'/assets/images/pokemonLogo.png'}
          width={100}
          height={50}
        />
        <p style={{ fontWeight: 200 }}>Developed by Dylas</p>
      </div>
    </>
  );
}

export default MyApp;
