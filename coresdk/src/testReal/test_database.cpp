//
//  test_database.cpp
//  splashkit
//
//  Created by Jake Renzella on 3/08/2016.
//  Copyright © 2016 Andrew Cain. All rights reserved.
//

#include "database.h"
#include "utils.h"
#include <iostream>
using namespace std;
using namespace splashkit_lib;

void run_database_tests()
{
    query_result cursor;

    open_database("test1", "test_database");
    database db = database_named("test1");

    bool result = has_database("test1");
    cout << (result ? "Database Opened\n\n" : "Database Not Opened\n\n");

    run_sql(db, "DROP TABLE friends;");

    run_sql(db, "CREATE TABLE friends (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, weight REAL, isStudent BOOL);");

    run_sql(db, "INSERT INTO friends VALUES (10001, \"Jake Renzella\", 21, 32.43, 1);");
    cout << "Expected to insert 1 row:" << rows_changed(db) << endl;

    run_sql(db, "INSERT INTO friends VALUES (20002, \"Andrew Cain\", 19, 42.43, 0);");
    cout << "Expected to insert 1 row:" << rows_changed(db) << endl;

    run_sql(db, "INSERT INTO friends VALUES (30003, \"Alex C\", 20, 42.43, 0), (40004, \"Reuben Wilson\", 40, 454, 1);");
    cout << "Expected to insert 2 rows:" <<rows_changed(db) << endl;

    //--------------------------------------------------------------

    cout << "Testing garbage query..." << endl;
    cursor = run_sql("test1", "garbage_queryfkdsafjkdls :(");
    result = query_success(cursor);
    cout << (result ? "Query successful\n" : "Query unsuccessful\n");
    cout << error_message(cursor) << endl;

    cout << "Testing unclosed query..." << endl;
    cursor = run_sql("test1", "INSERT INTO friends VALUES (30003, \"Alex C\", 20, 42.43, 0");
    result = query_success(cursor);
    cout << (result ? "Query successful\n" : "Query unsuccessful\n");

    cout << "Testing good query..." << endl;
    cursor = run_sql("test1", "select * from friends;");
    result = query_success(cursor);
    cout << (result ? "Query successful\n" : "Query unsuccessful\n");

    cout << endl << endl;

    //--------------------------------------------------------------

    cout << "Query has " << query_column_count(cursor) << " columns - expect 5" << endl;

    for (reset_query_result(cursor); has_row(cursor); get_next_row(cursor))
    {
        cout << "Test read int past cols available... " << query_column_for_int(cursor, 100) << endl;
        cout << "Test read string past cols available... " << query_column_for_string(cursor, 100) << endl;
        cout << "Test read double past cols available... " << query_column_for_double(cursor, 100) << endl;
        cout << "Test read bool past cols available... " << query_column_for_bool(cursor, 100) << endl;
        cout << "data in index 0 is: " << query_column_for_int(cursor, 0) << endl;
        cout << "data in index 1 is: " << query_column_for_string(cursor, 1) << endl;
        cout << "data in index 2 is: " << query_column_for_int(cursor, 2) << endl;
        cout << "data in index 3 is: " << query_column_for_double(cursor, 3) << endl;
        cout << "data in index 4 is: " << query_column_for_bool(cursor, 4) << endl << endl;
    }

    cout << "Test read after end... " << query_column_for_int(cursor, 0) << endl;

    while (has_row(cursor))
    {
        cout << "data in index 0 is: " << query_column_for_int(cursor, 0) << endl;
        cout << "data in index 1 is: " << query_column_for_string(cursor, 1) << endl;
        cout << "data in index 2 is: " << query_column_for_int(cursor, 2) << endl;
        cout << "data in index 3 is: " << query_column_for_double(cursor, 3) << endl;
        cout << "data in index 4 is: " << query_column_for_bool(cursor, 4) << endl << endl;

        get_next_row(cursor);
    }

    cursor = run_sql(db, "DELETE FROM friends;");
    cout << "Expect 4 rows to have been deleted: " << rows_changed(db) << endl;

    cursor = run_sql("test1", "select * from friends;");

    //should be skipped
    while (has_row(cursor))
    {
        cout << "data should not be in db: " << query_column_for_int(cursor, 0) << endl;
        cout << "data should not be in db: " << query_column_for_string(cursor, 1) << endl;
        cout << "data should not be in db: " << query_column_for_int(cursor, 2) << endl;
        cout << "data should not be in db: " << query_column_for_double(cursor, 3) << endl;
        cout << "data should not be in db: " << query_column_for_bool(cursor, 4) << endl << endl;

        get_next_row(cursor);
    }

    reset_query_result(cursor);

    cout << "data should not be in db: " << query_column_for_int(cursor, 0) << endl;
    cout << "data should not be in db: " << query_column_for_string(cursor, 1) << endl;
    cout << "data should not be in db: " << query_column_for_int(cursor, 2) << endl;
    cout << "data should not be in db: " << query_column_for_double(cursor, 3) << endl;
    cout << "data should not be in db: " << query_column_for_bool(cursor, 4) << endl << endl;

    cout << "data should not be in db: " << query_type_of_col(cursor, 0) << endl;
    cout << "data should not be in db: " << query_type_of_col(cursor, 1) << endl;
    cout << "data should not be in db: " << query_type_of_col(cursor, 2) << endl;
    cout << "data should not be in db: " << query_type_of_col(cursor, 3) << endl;
    cout << "data should not be in db: " << query_type_of_col(cursor, 4) << endl << endl;

    get_next_row(cursor);

    cout << "data should not be in db: " << query_column_for_int(cursor, 0) << endl;
    cout << "data should not be in db: " << query_column_for_string(cursor, 1) << endl;
    cout << "data should not be in db: " << query_column_for_int(cursor, 2) << endl;
    cout << "data should not be in db: " << query_column_for_double(cursor, 3) << endl;
    cout << "data should not be in db: " << query_column_for_bool(cursor, 4) << endl << endl;

    free_all_query_results();

    cout << "closing database" << endl;
    free_database("test1");

    result = has_database("test1");
    cout << (result ? "Database Opened\n" : "Database Not Opened\n");
}
