const Divider = (props: { width: number; height: number, color: string }) => {
	return <div style={{ width: props.width, height: props.height, backgroundColor: props.color }} />;
};

export default Divider;
