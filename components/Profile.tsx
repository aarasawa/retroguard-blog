import React from "react";
import Router from "next/router";
import { GetStaticProps } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type ProfileProps = {
  id: number;
  bio: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

const Profile: React.FC<{ profile: ProfileProps }> = ({ profile }) => {
  const userName = profile.user ? profile.user.name : "Unknown user";
  return (
    <div onClick={() => Router.push("/profile/[id]", `/profile/${profile.id}`)}>
      <h2>{userName}&apos;s Profile</h2>
      <p>Bio: {profile.bio ? profile.bio : "No bio available"}</p>
      <small>Email: {profile.user.email}</small>
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
          cursor: pointer;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin: 1rem 0;
        }
        div:hover {
          background: #f0f0f0;
        }
        h2 {
          margin: 0;
        }
        small {
          display: block;
          margin-top: 1rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const profile = await prisma.profile.findFirst({
    include: {
      user: true,
    },
  });

  return {
    props: {
      profile: profile || null,
    },
  };
};

export default Profile;
