import { mapCategoriesWithServices } from "@/utils/utils";
import Listing from "./components/listing";
import { CategoryProvider } from "@/providers/CategoryContext";

export default async function Home() {
    const categoriesRequest = fetch(
        "https://www.citizenservices.gov.bt/g2cPortalApi/getCategory",
        {
            cache: "force-cache",
            next: {
                revalidate: 86400,
                tags: ["categories"],
            },
        }
    );
    const servicesRequest = fetch(
        "https://www.citizenservices.gov.bt/g2cPortalApi/getService",
        {
            cache: "force-cache",
            next: {
                revalidate: 86400,
                tags: ["services"],
            },
        }
    );

    const allPromises = await Promise.all([categoriesRequest, servicesRequest]);
    const categoriesResponse = await allPromises[0].json();
    const servicesResponse = await allPromises[1].json();
    const mappedData = mapCategoriesWithServices(
        categoriesResponse,
        servicesResponse
    );

    // const categories = await categoriesRequest.json();
    return (
        <div>
            <CategoryProvider value={mappedData}>
                <Listing />
            </CategoryProvider>
            {/* <Listing categories={categories} /> */}
        </div>
    );
}
