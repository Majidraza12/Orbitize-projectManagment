// components/MembersDisplay.tsx
"use client"
import React, { useEffect, useState } from "react";
import { getMembersAndProfiles } from "@/actions/members";
import { User } from "lucide-react";
import DisplayProjectDetails from "./DisplayProjectDetails";
import AddMemberButton from "./AddMemberButton";

// Inline Member interface definition
interface Member {
  role: string;
  user_profiles: {
    username: string;
    email: string;
  };
}

const MembersDisplay = ({ projectId }: { projectId: string }) => {
  const [members, setMembers] = useState<Member[]>([]); // Ensure the state type matches the Member interface
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  const capitalize = (str : string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersData = await getMembersAndProfiles(projectId);
        setMembers(membersData);
      } catch (err) {
        setError("Error fetching members");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [projectId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-[20%]">
      <div className="flex items-center p-2 justify-between">
        <h1 className="text-2xl mb-2 mt-2">
          Project Members
        </h1>
        <AddMemberButton projectId={projectId} />
      </div>
      <div className="flex flex-col">
        {members.length > 0 ? (
          members.map((member, index) => (
            <div key={index} className="mb-4 border rounded-lg p-2 ">
              <div className="flex">
                <User />
                <div className="flex items-center">
                  <p className="text-lg">
                    {capitalize(member.user_profiles.username)}
                  </p>
                  <p className="text-sm">-{member.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                {member.user_profiles.email}
              </p>
            </div>
          ))
        ) : (
          <p>No members found for this project.</p>
        )}
      </div>
      <DisplayProjectDetails projectId={projectId} />
    </div>
  );
};

export default MembersDisplay;
