import { useRouter } from 'next/router';

const UseCurrentUrl = () => {
  const router = useRouter();
  const currentUrl = router.asPath;
  return {
    currentUrl: currentUrl,
  };
};
export default UseCurrentUrl;
