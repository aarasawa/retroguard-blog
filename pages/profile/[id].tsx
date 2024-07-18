import { GetStaticProps, GetStaticPaths } from "next";
import { PrismaClient } from "@prisma/client";
import { ProfileProps } from "../../components/Profile";

const prisma = new PrismaClient();

const ProfilePage: React.FC<{ profile: ProfileProps }> = ({ profile }) => {
  if (!profile) {
    return <div>No profile found</div>;
  }

  const userName = profile.user ? profile.user.name : "Unknown user";

  return (
    <div>
      <h1>{userName}&apos;s Profile</h1>
      <p>{profile.bio}</p>
      <small>{profile.user.email}</small>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const profiles = await prisma.profile.findMany();

  const paths = profiles.map((profile) => ({
    params: { id: profile.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const profile = await prisma.profile.findUnique({
    where: {
      id: Number(params?.id),
    },
    include: {
      user: true,
    },
  });

  return {
    props: {
      profile,
    },
  };
};

export default ProfilePage;
