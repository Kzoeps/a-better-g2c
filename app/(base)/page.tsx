import { CategoryProvider } from "@/providers/CategoryContext";
import {
    getCategoriesWithServices,
    mapCategoriesWithServices,
} from "@/utils/utils";
import Listing from "../components/listing";
import { CATEGORIES } from "@/utils/categories-constants";
import { SERVICES } from "@/utils/subcategories-constants";

export default async function Home() {
    let mappedData;
    try {
        mappedData = await getCategoriesWithServices();
    } catch {
        mappedData = mapCategoriesWithServices(CATEGORIES, SERVICES);
    }


    return (
        <div>
            <CategoryProvider value={mappedData}>
                <Listing />
            </CategoryProvider>
        </div>
    );
}
