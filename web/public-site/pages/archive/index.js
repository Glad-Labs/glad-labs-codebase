export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/archive/1',
      permanent: true,
    },
  };
};

export default function ArchiveIndex() {
  return null; // This component will not be rendered
}
