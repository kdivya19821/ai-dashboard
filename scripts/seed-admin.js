const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "test@test.com";
    const adminPassword = "Test123@123";

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword,
            role: "ADMIN",
            status: "APPROVED",
        },
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: "Admin",
            role: "ADMIN",
            status: "APPROVED",
        },
    });

    console.log("Admin seeded:", admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
