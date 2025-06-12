import React, { useEffect, useState } from 'react';
import { useGroup } from '../../context/GroupContext';
import groupMemberService from '../../services/groupMemberService';
import { GroupUser } from '../../types/group';
import { toast } from 'react-toastify';

const DashboardMembers: React.FC = () => {
  const { selectedGroupId } = useGroup();
  const [members, setMembers] = useState<GroupUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedGroupId) {
      loadMembers();
    }
  }, [selectedGroupId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await groupMemberService.getGroupMembers(selectedGroupId!);
      setMembers(data);
    } catch (error) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Group Members</h2>
      {members.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No members found</p>
      ) : (
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{`${member.user.firstName} ${member.user.lastName}`}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{member.user.email}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardMembers; 