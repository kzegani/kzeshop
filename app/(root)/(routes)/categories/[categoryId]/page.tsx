const CategoriesPage = async (
    props: {
        params: Promise<{ categoryId: string }>
    }
) => {
    const params = await props.params;
    return (
		<div>
			This is a category page &quot;{params.categoryId}&quot;
		</div>
	);
}

export default CategoriesPage;
