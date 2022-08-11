import { useEffect } from 'react';
import { useRouter } from 'next/router';

function Loja() {
  const router = useRouter();
  useEffect(() => {
    router.push('/store');
  }, [router]);
  return (
    <>
      <h1>Carregando...</h1>
    </>
  );
}

export default Loja;
