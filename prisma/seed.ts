import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {

  
  // USER PERMISSIONS
  const adminDefaultPermission = await prisma.permissions.findMany({
    where: { permission: 'admin' },
  });

  if (!adminDefaultPermission) {
    await prisma.permissions.create({
      data: {
        permission: 'admin',
        description: 'only the app administrators can have this permission',
      },
    });
    console.log('Default admin permission created');
  } else {
    console.log('Default admin permission already exists');
  }

 const userDefaultPermission = await prisma.permissions.findMany({
    where: { permission: 'user' },
  });

  if (userDefaultPermission.length === 0) {
    await prisma.permissions.create({
      data: {
        permission: 'user',
        description: 'every regular user should have this permission',
      },
    });
    console.log('Default user permission created');
  } else {
    console.log('Default user permission already exists');
  }

   
  // PROJECTS VISIBILITIES
  const publicProjectVisibility = await prisma.projectVisibility.findMany({
    where: { name: 'public' },
  });

  if (publicProjectVisibility.length === 0) {
    await prisma.projectVisibility.create({
      data: {
        name: 'public',
        description:
          'this is a public project, which can be viewed by everyone',
      },
    });
    console.log('Default public visibility created');
  } else {
    console.log('Default public visibility already exists');
  }

  const privateProjectVisibility = await prisma.projectVisibility.findMany({
    where: { name: 'private' },
  });

  if (privateProjectVisibility.length === 0) {
    await prisma.projectVisibility.create({
      data: {
        name: 'private',
        description:
          'this is a private project, which can be viewed by people with permissions',
      },
    });
    console.log('Default private visibility created');
  } else {
    console.log('Default private visibility already exists');
  }

  // PROJECTS PERMISSIONS
  const modProjectPermission = await prisma.projectPermissions.findMany({
    where: { name: 'mod' },
  });

  if (modProjectPermission.length === 0) {
    await prisma.projectPermissions.create({
      data: {
        name: 'mod',
        description:
          'everyone with this permission can manage the project content, which includes add or remove new users from it and edit boards',
      },
    });
    console.log('Default project mod permission created');
  } else {
    console.log('Default project mod permission already exists');
  }

  const memberProjectPermission = await prisma.projectPermissions.findMany({
    where: { name: 'member' },
  });

  if (memberProjectPermission.length === 0) {
    await prisma.projectPermissions.create({
      data: {
        name: 'member',
        description:
          'everyone with this permission can see and write to the project content',
      },
    });
    console.log('Default project member permission created');
  } else {
    console.log('Default project member permission already exists');
  }

  const guestProjectPermission = await prisma.projectPermissions.findMany({
    where: { name: 'guest' },
  });

  if (guestProjectPermission.length === 0) {
    await prisma.projectPermissions.create({
      data: {
        name: 'guest',
        description:
          'everyone with this permission can only see the project content',
      },
    });
    console.log('Default project guest permission created');
  } else {
    console.log('Default project guest permission already exists');
  } 
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
