import Layout from '../components/Layout';
import { signin, useSession } from 'next-auth/client';

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
