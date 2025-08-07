use dep::ecrecover; 

fn main(
    pub_key_x: [u8; 32], 
    pub_key_y: [u8; 32], 
    signature: [u8; 64], 
    hashed_message: [u8; 32], 
    expected_address : Field
) {
    let address = ecrecover::ecrecover(pub_key_x, pub_key_y, signature, hashed_message);

    assert(address == expected_address, "Address does not match the expected address");

}

//#[test]
//fn test_main() {
//    main(1, 2);

//    // Uncomment to make test fail
//    // main(1, 1);
//}



//use dep::std;
//use dep::ecrecover;

//fn main(
//  pub_key_x: [u8; 32],
//  pub_key_y: [u8; 32],
//  signature: [u8; 64],
//  hashed_message: pub [u8; 32]
//) -> pub Field {
//  let address = ecrecover::ecrecover(pub_key_x, pub_key_y, signature, hashed_message);
//  std::println(address);

//  address // address is represented as `Field`, but is constrained to be within 160 bits
//}