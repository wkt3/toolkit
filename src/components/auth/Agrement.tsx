"use client"
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function AgreementAndLinks() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      {/* Terms Agreement */}
      <div className="flex items-start gap-2">
        <Checkbox
          id="terms"
          checked={agreed}
          onCheckedChange={value => setAgreed(value === true)}
        />
        <Label htmlFor="terms" className="leading-snug">
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Privacy Policy
          </Link>
        </Label>
      </div>

      {/* Game Info Links */}
      <div className="flex justify-between text-xs font-medium text-center">
        <Link
          href="/games"
          className="text-orange-600 underline hover:text-orange-800"
        >
          🎮 Games
        </Link>
        <Link
          href="/how-to-play"
          className="text-orange-600 underline hover:text-orange-800"
        >
          📘 How to Play
        </Link>
      </div>
    </div>
  );
}
