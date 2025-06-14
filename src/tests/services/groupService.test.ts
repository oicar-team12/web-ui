import groupService from '../../services/groupService';
import { GroupUserRole } from '../../types/group';

describe('GroupService', () => {
  beforeEach(() => {
    // Reset mock data before each test
    localStorage.clear();
  });

  it('should fetch groups successfully', async () => {
    const groups = await groupService.getGroups();
    expect(Array.isArray(groups)).toBe(true);
  });

  it('should create a group successfully', async () => {
    const groupData = {
      name: 'Test Group',
      description: 'Test Description',
    };
    const group = await groupService.createGroup(groupData);
    expect(group).toHaveProperty('id');
    expect(group.name).toBe(groupData.name);
  });

  it('should update a group name successfully', async () => {
    const groupId = 1;
    const newName = 'Updated Group Name';
    const updatedGroup = await groupService.updateGroupName(groupId, newName);
    expect(updatedGroup.name).toBe(newName);
  });

  it('should delete a group successfully', async () => {
    const groupId = 1;
    await expect(groupService.deleteGroup(groupId)).resolves.not.toThrow();
  });

  it('should add a group user by email successfully', async () => {
    const groupId = 1;
    const email = 'test@example.com';
    await expect(groupService.addGroupUserByEmail(groupId, email)).resolves.not.toThrow();
  });

  it('should fetch group members successfully', async () => {
    const groupId = 1;
    const members = await groupService.getGroupMembers(groupId);
    expect(Array.isArray(members)).toBe(true);
  });
}); 