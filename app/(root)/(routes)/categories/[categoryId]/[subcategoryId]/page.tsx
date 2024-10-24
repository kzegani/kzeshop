const SubCategoriesPage = async (
    props: {
        params: Promise<{ subcategoryId: string }>
    }
) => {
    const params = await props.params;
    return (
		<div>
			This is a subcategory page: {params.subcategoryId}
		</div>
	);
}

export default SubCategoriesPage;