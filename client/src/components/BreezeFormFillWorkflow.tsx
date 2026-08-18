import React, { useState } from "react";

type BreezeFormFillWorkflowProps = {
  leadName: string;
};

function contactAlias(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}.breeze-review.local`;
}

export function BreezeFormFillWorkflow({ leadName }: BreezeFormFillWorkflowProps) {
  const [step, setStep] = useState(1);
  const [contactPrepared, setContactPrepared] = useState(false);
  const [eligibility, setEligibility] = useState<"yes" | "no" | "">("");
  const [consent, setConsent] = useState(false);

  const canContinue =
    (step === 1 && contactPrepared) ||
    (step === 2 && eligibility !== "") ||
    (step === 3 && consent);

  return (
    <section className="mt-5 rounded-xl border border-[#14b8a6]/35 bg-black p-4" aria-label="Staged Breeze form-fill workflow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#99f6e4]">Staged form-fill workflow</p>
          <h3 className="mt-1 text-base font-black text-white">Review workflow for {leadName}</h3>
        </div>
        <span className="rounded-full border border-[#14b8a6]/40 px-2 py-1 text-[10px] font-bold text-[#99f6e4]">Step {step} of 4</span>
      </div>

      {step === 1 && (
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p>Prepare a contact profile for the staged Breeze review workflow. No external message or form submission is triggered.</p>
          {contactPrepared ? (
            <div className="rounded-lg border border-[#14b8a6]/35 bg-black p-3 text-xs text-[#ccfbf1]">
              <p><strong>Contact email:</strong> {contactAlias(leadName)}</p>
              <p className="mt-1"><strong>Contact phone:</strong> Reserved for activation</p>
            </div>
          ) : (
            <button type="button" onClick={() => setContactPrepared(true)} className="rounded-lg bg-[#14b8a6] px-3 py-2 text-xs font-bold text-black">Prepare contact profile</button>
          )}
        </div>
      )}

      {step === 2 && (
        <fieldset className="mt-4 space-y-3 text-sm text-slate-300">
          <legend className="font-bold text-white">Eligibility question</legend>
          <p>Does the lead want to review disability-income protection options?</p>
          <label className="flex items-center gap-2"><input type="radio" name="breeze-eligibility" value="yes" checked={eligibility === "yes"} onChange={() => setEligibility("yes")} /> Yes, continue to the quote flow</label>
          <label className="flex items-center gap-2"><input type="radio" name="breeze-eligibility" value="no" checked={eligibility === "no"} onChange={() => setEligibility("no")} /> No, retain as a review record</label>
        </fieldset>
      )}

      {step === 3 && (
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p>Review consent before any live contact or external form workflow is activated.</p>
          <label className="flex items-start gap-2"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-1" /> <span>I confirm this is a staged review and no contact or form submission will be made.</span></label>
        </div>
      )}

      {step === 4 && (
        <div className="mt-4 rounded-lg border border-[#fbbf24]/35 bg-black p-3 text-sm text-[#fde68a]">
          <strong>Ready for review.</strong> Unique contact provisioning and external form submission remain disabled until an approved workflow is connected.
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <button type="button" onClick={() => setStep(current => Math.max(1, current - 1))} disabled={step === 1} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-slate-200 disabled:cursor-not-allowed disabled:opacity-40">Back</button>
        {step < 4 ? <button type="button" onClick={() => setStep(current => current + 1)} disabled={!canContinue} className="rounded-lg bg-[#fbbf24] px-3 py-2 text-xs font-bold text-black disabled:cursor-not-allowed disabled:opacity-40">Continue</button> : <button type="button" disabled className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-slate-400">External submission is disabled</button>}
      </div>
    </section>
  );
}
