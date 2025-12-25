import { motion } from "framer-motion";

export const Skeleton = () => {
	return <div className="w-5/6 h-[200px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />;
};

export const SkeletonContainer = () => {
	return (
		<div className="flex flex-col justify-center items-center space-y-8 w-full">
			<Skeleton />
			<Skeleton />
		</div>
	);
};
