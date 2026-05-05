import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background py-20">
      <div className="glass-card p-2">
        <SignIn />
      </div>
    </div>
  );
}
