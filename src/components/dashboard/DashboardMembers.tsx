import React, { useEffect } from 'react';
import { GroupUser } from '../../types/group';
import groupMemberService from '../../services/groupMemberService';

interface DashboardMembersProps {
  selectedGroupId: number;
  members: GroupUser[];
  onMembersUpdate?: (members: GroupUser[]) => void;
}

const DashboardMembers: React.FC<DashboardMembersProps> = ({ selectedGroupId, members, onMembersUpdate }) => {
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await groupMemberService.getGroupMembers(selectedGroupId.toString());
        if (onMembersUpdate) {
          onMembersUpdate(data);
        }
      } catch (err) {
        console.error('Failed to fetch members:', err);
      }
    };
    fetchMembers();
  }, [selectedGroupId, onMembersUpdate]);

  return (
    <div>
      <h2>Group Members</h2>
      {members.length > 0 ? (
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{member.firstName} {member.lastName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{member.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No members found</p>
      )}
    </div>
  );
};

export default DashboardMembers; 