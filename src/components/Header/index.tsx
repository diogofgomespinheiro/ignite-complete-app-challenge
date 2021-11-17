import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from './header.module.scss';

export default function Header() {
  const { push } = useRouter();
  return (
    <header className={styles.container}>
      <nav className={styles.content}>
        <Image
          src="/assets/logo.svg"
          alt="logo"
          height={27}
          width={239}
          onClick={() => push('/')}
        />
      </nav>
    </header>
  );
}
