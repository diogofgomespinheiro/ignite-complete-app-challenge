import Image from 'next/image';

import styles from './text-icon.module.scss';

type TextIconProps = {
  icon: 'calendar' | 'user' | 'clock';
  text: string;
};

function TextIcon({ icon, text }: TextIconProps) {
  return (
    <div className={styles.container}>
      <Image src={`/assets/${icon}.svg`} alt={icon} height={20} width={20} />
      <span>{text}</span>
    </div>
  );
}

export default TextIcon;
