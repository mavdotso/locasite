import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';

export default async function DashboardPage() {
    const tenants = await fetchQuery(api.tenants.list);

    return (
        <div className="p-6">
            <h1 className="mb-4 font-bold text-2xl">Tenant Dashboard</h1>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                {tenants?.map(tenant => (
                    <div key={tenant._id} className="p-4 border rounded-lg">
                        <h2 className="font-semibold text-lg">{tenant.name}</h2>
                        <p className="text-gray-600 text-sm">Subdomain: {tenant.subdomain}</p>
                        <p className="text-gray-500 text-xs">
                            Created: {new Date(tenant.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}