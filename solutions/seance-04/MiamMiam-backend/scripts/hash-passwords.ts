import fs from "fs";
import bcrypt from "bcrypt";
import { UserDBO } from "../src/models/user.model";

async function hashExistingPasswords(): Promise<void> {
  const path = "data/users.json";
  const users: UserDBO[] = JSON.parse(
    fs.readFileSync(path, "utf-8")
  );

  for (const user of users) {
    if (/^\$2[ab]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(user.password)) {
      continue;
    }

    user.password = await bcrypt.hash(user.password, 10);
  }

  fs.writeFileSync(path, JSON.stringify(users, null, 2), "utf-8");
}

hashExistingPasswords().catch(console.error);