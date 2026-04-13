import AdminLayout from "../../components/layout/AdminLayout";

export default function AdminPlaceholderPage({ title, description }) {
  return (
    <AdminLayout title={title} description={description}>
      <section className="rounded-[24px] border border-[#e8edf3] bg-white p-6 shadow-[0_16px_38px_rgba(15,20,30,0.05)]">
        <h2 className="text-[1.4rem] font-semibold tracking-[-0.03em] text-[#141b24]">{title}</h2>
        <p className="mt-3 max-w-[680px] text-[1rem] leading-7 text-[#6d7788]">
          This page shell is ready in the correct Rocket project. We can now connect the real CMS or API data without changing the layout structure.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[18px] bg-[#f6f8fb] p-5">
            <p className="font-semibold text-[#141b24]">Layout</p>
            <p className="mt-2 text-sm leading-6 text-[#6d7788]">Built and ready for real content.</p>
          </div>
          <div className="rounded-[18px] bg-[#f6f8fb] p-5">
            <p className="font-semibold text-[#141b24]">Status</p>
            <p className="mt-2 text-sm leading-6 text-[#6d7788]">Frontend ready, backend pending.</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

