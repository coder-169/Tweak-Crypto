
const AuthLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full items-center justify-center space-y-6">
      {children}
    </div>
  );
};
 
export default AuthLayout;
