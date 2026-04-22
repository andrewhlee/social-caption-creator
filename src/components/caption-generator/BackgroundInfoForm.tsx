"use client";

interface BackgroundInfoFormProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BackgroundInfoForm({
  value,
  onChange,
}: BackgroundInfoFormProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="background-info"
        className="block text-sm font-semibold text-pds-navy"
      >
        Background Information *
      </label>
      <textarea
        id="background-info"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe what's happening in the photo. For example: Upper School students at the annual Science Fair presenting their robotics project. This is the 2nd year our team has competed at the regional level."
        rows={5}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pds-navy focus:border-transparent resize-none"
      />
      <p className="text-xs text-slate-400">
        Include who is in the photo, what event or activity is happening, grade
        level, and any notable achievements.
      </p>
    </div>
  );
}
