import './Skeleton.css';

type Props = {
  height?: number;
};

const Skeleton = ({ height = 16 }: Props) => {
  return <div className="skeleton" style={{ height }} />;
};

export default Skeleton;
