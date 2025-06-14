import React, { useState, useEffect } from 'react';
import { GroupUser, GroupUserRole } from '../types/group';
import groupService from '../services/groupService';

interface GroupMembersProps {
  groupId: number;
}

const GroupMembers: React.FC<GroupMembersProps> = ({ groupId }) => {
  const [members, setMembers] = useState<GroupUser[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');

  useEffect(() => {
    loadMembers();
  }, [groupId]);

  const loadMembers = async () => {
    // Assuming getGroupMembers is still available for fetching members
    const fetchedMembers = await groupService.getGroupMembers(groupId);
    setMembers(fetchedMembers);
  };

  const handleAddUserByEmail = async () => {
    if (!newUserEmail) return;
    try {
      await groupService.addGroupUserByEmail(groupId, newUserEmail);
      setNewUserEmail('');
      loadMembers();
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  return (
    <div>
      <h2>Group Members</h2>
      <div>
        <input
          type="email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder="Invite user by email"
        />
        <button onClick={handleAddUserByEmail}>Add User</button>
      </div>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.email} - {member.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupMembers; 