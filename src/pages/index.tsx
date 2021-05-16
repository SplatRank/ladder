import { Button } from '@chakra-ui/button';
import { signin, useSession } from 'next-auth/client';
import Layout from '@/components/Layout';

const Index: React.FC = () => {
  const [session, loading] = useSession();

  if (!session) {
    return (
      <Layout>
        <button onClick={() => signin('twitter')}>Sign in</button>
      </Layout>
    );
  }

  return <Layout>{loading ? 'Loading' : JSON.stringify(session.user)}</Layout>;
};

export default Index;
